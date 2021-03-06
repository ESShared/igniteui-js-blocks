import {Injectable, NgZone} from "@angular/core";
import { forEach } from "@angular/router/src/utils/collection";

const EVENT_SUFFIX: string = "precise";

/**
 * Touch gestures manager based on Hammer.js
 * Use with caution, this will track references for single manager per element. Very TBD. Much TODO.
 */
@Injectable()
export class HammerGesturesManager {
    /**
     * Event option defaults for each recognizer, see http://hammerjs.github.io/api/ for API listing.
     */
    protected hammerOptions: any[] = [
        {
            name: "pan",
            options: {
                threshold: 0
            }
        }, {
            name: "pinch",
            options: {
                enable: true
            }
        }, {
            name: "rotate",
            options: {
                enable: true
            }
        }];

    private _hammerManagers: Array<{ element: EventTarget, manager: HammerManager; }> = [];

    constructor(private _zone: NgZone) {
    }

    public supports(eventName: string): boolean {
        return eventName.toLowerCase().endsWith("." + EVENT_SUFFIX);
    }

    /**
     * Add listener extended with options for Hammer.js. Will use defaults if none are provided.
     * Modeling after other event plugins for easy future modifications.
     */
    public addEventListener(element: HTMLElement,
                            eventName: string,
                            eventHandler: (eventObj) => void,
                            options: object = null): () => void {

        // Creating the manager bind events, must be done outside of angular
        return this._zone.runOutsideAngular(() => {
            // new Hammer is a shortcut for Manager with defaults
            const mc = new Hammer(element);
            for (const item of this.hammerOptions) {
                mc.get(item.name).set(item.options);
            }
            const handler = (eventObj) => { this._zone.run(() => { eventHandler(eventObj); }); };
            mc.on(eventName, handler);
            return () => { mc.off(eventName, handler); };
        });
    }

    /**
     * Add listener extended with options for Hammer.js. Will use defaults if none are provided.
     * Modeling after other event plugins for easy future modifications.
     *
     * @param target Can be one of either window, body or document(fallback default).
     */
    public addGlobalEventListener(target: string, eventName: string, eventHandler: (eventObj) => void): () => void {
        const element = this.getGlobalEventTarget(target);

        // Creating the manager bind events, must be done outside of angular
        return this._zone.runOutsideAngular(() => {
            // new Hammer is a shortcut for Manager with defaults

            const mc: HammerManager = new Hammer(element as HTMLElement);
            this.addManagerForElement(element as HTMLElement, mc);

            for (const item of this.hammerOptions) {
                mc.get(item.name).set(item.options);
            }
            const handler = (eventObj) => {
                this._zone.run(() => {
                    eventHandler(eventObj);
                });
            };
            mc.on(eventName, handler);
            return () => { mc.off(eventName, handler); };
        });
    }

    /** temp replacement for DOM.getGlobalEventTarget(target) because DI won't play nice for now */
    public getGlobalEventTarget(target: string): EventTarget {
        switch (target) {
            case "window":
                return window;
            case "body":
                return document.body;
            default:
                return document;
        }
    }

    /**
     * Set HammerManager options.
     *
     * @param element The DOM element used to create the manager on.
     *
     * ### Example
     *
     * ```ts
     * manager.setManagerOption(myElem, "pan", { pointers: 1 });
     * ```
     */
    public setManagerOption(element: EventTarget, event: string, options: any) {
        const manager = this.getManagerForElement(element);
        manager.get(event).set(options);
    }

    /**
     * Add an element and manager map to the internal collection.
     *
     * @param element The DOM element used to create the manager on.
     */
    public addManagerForElement(element: EventTarget, manager: HammerManager) {
        this._hammerManagers.push({element, manager});
    }

    /**
     * Get HammerManager for the element or null
     *
     * @param element The DOM element used to create the manager on.
     */
    public getManagerForElement(element: EventTarget): HammerManager {
        const result =  this._hammerManagers.filter((value, index, array) => {
            return value.element === element;
        });
        return result.length ? result[0].manager : null;
    }

    /**
     * Destroys the HammerManager for the element, removing event listeners in the process.
     *
     * @param element The DOM element used to create the manager on.
     */
    public removeManagerForElement(element: HTMLElement) {
        let index: number = null;
        for (let i = 0; i < this._hammerManagers.length; i++) {
            if (element === this._hammerManagers[i].element) {
                index = i;
                break;
            }
        }
        if (index !== null) {
            const item = this._hammerManagers.splice(index, 1)[0];
            // destroy also
            item.manager.destroy();
        }
    }

    /** Destroys all internally tracked HammerManagers, removing event listeners in the process. */
    public destroy() {
        for (const item of this._hammerManagers) {
            item.manager.destroy();
        }
        this._hammerManagers = [];
    }
}
