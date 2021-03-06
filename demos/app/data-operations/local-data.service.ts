import { Injectable } from "@angular/core";
import { DataGenerator, IDataColumn } from "../../../src/data-operations/test-util/data-generator";
@Injectable()
export class LocalDataService {
    private dataGenerator: DataGenerator = new DataGenerator(100000, 4);
    public getColumns(): IDataColumn[] {
        return this.dataGenerator.columns;
    }
    public getData() {
        return new Promise((resolve, rejct) => {
            resolve(this.dataGenerator.data);
        });
    }
}
