import { Component, ViewChild } from "@angular/core";
import {
    async,
    TestBed
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { IgxIcon, IgxIconModule } from "../icon/icon.component";
import { IgxBadge, IgxBadgeModule } from "./badge.component";

describe("Badge", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                InitBadge,
                InitBadgeWithDefaults,
                InitBadgeWithIcon,
                IgxBadge,
                InitBadgeWithIconARIA,
                IgxIcon
            ]
        }).compileComponents();
    }));

    it("Initializes badge ", () => {
        const fixture = TestBed.createComponent(InitBadge);
        fixture.detectChanges();
        const badge = fixture.componentInstance.badge;

        expect(badge.value).toBeTruthy();
        expect(badge.type).toBeTruthy();
        const contain = fixture.elementRef.nativeElement
            .getElementsByTagName("div")[0].classList.contains("igx-badge--bottom-left");
        expect(contain).toBeTruthy();
        const text = fixture.elementRef.nativeElement.getElementsByClassName("igx-badge__circle")[0].textContent;
        expect(parseInt(text, 10) === 22).toBeTruthy();
    });

    it("Initializes badge defaults", () => {
        const fixture = TestBed.createComponent(InitBadgeWithDefaults);
        fixture.detectChanges();
        const badge = fixture.componentInstance.badge;

        const contain = fixture.elementRef.nativeElement
            .getElementsByTagName("div")[0].classList.contains("igx-badge--top-right");
        expect(contain).toBeTruthy();
        expect(fixture.elementRef.nativeElement.getElementsByTagName("span")[0].textContent === "?").toBeTruthy();
        expect(fixture.elementRef.nativeElement.getElementsByTagName("i").length === 0).toBeTruthy();
    });

    it("Initializes badge with icon", () => {
        const fixture = TestBed.createComponent(InitBadgeWithIcon);
        fixture.detectChanges();
        const badge = fixture.componentInstance.badge;
        const divContainer = fixture.elementRef.nativeElement.querySelectorAll("div.igx-badge__circle");

        expect(divContainer).toBeTruthy();
        expect(badge.iconBdg === "person").toBeTruthy();
        expect(badge.type === "info").toBeTruthy();
        expect(badge.value === "?").toBeTruthy();
        const contain = fixture.elementRef.nativeElement.getElementsByTagName("div")[0]
            .classList.contains("igx-badge--top-left");
        expect(contain).toBeTruthy();
        expect(divContainer[0].classList.contains("igx-badge__circle--info")).toBeTruthy();
    });

    it("Initializes badge with icon ARIA", () => {
        const fixture = TestBed.createComponent(InitBadgeWithIconARIA);
        fixture.detectChanges();
        const badge = fixture.componentInstance.badge;
        const divContainer = fixture.elementRef.nativeElement.querySelectorAll("div.igx-badge__circle");

        expect(badge.roleDescription === "success type badge with icon type person").toBeTruthy();
        expect(divContainer[0].getAttribute("aria-roledescription") === "success type badge with icon type person")
            .toBeTruthy();
    });
});

@Component({ template: `<igx-badge type="error" value="22" position="bottom-left"></igx-badge>` })
class InitBadge {
    @ViewChild(IgxBadge) public badge: IgxBadge;
}

@Component({ template: `<igx-badge></igx-badge>` })
class InitBadgeWithDefaults {
    @ViewChild(IgxBadge) public badge: IgxBadge;
}

@Component({ template: `<igx-badge icon="person" type="info" position="top-left"></igx-badge>` })
class InitBadgeWithIcon {
    @ViewChild(IgxBadge) public badge: IgxBadge;
}

@Component({ template: `<igx-badge icon="person" type="success"></igx-badge>` })
class InitBadgeWithIconARIA {
    @ViewChild(IgxBadge) public badge: IgxBadge;
}
