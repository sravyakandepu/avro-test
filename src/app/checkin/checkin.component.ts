import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {CheckinService} from './checkin.service';

@Component({
    selector: 'app-checkin',
    templateUrl: './checkin.component.html',
    styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {
    orderItems: [] = [];
    private itemsList: [] = [];
    private displayItemTable: boolean;
    private displayOrderItemTable: boolean;

    constructor(private checkinService: CheckinService) {
    }

    tableData: [] = [];
    private checkObjct: { tableId: string };
    tableId: any;
    checksByTableId: any;
    alreadyCalledForCheck = [];

    @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;

    ngOnInit() {
        this.getTables();
    }

    getTables(): void {
        this.checkinService.getTables().subscribe(tables => {
            this.tableData = tables;
        });
    }

    createCheck(tableId) {
        if (!this.alreadyCalledForCheck.includes(tableId)) {
            this.checkObjct = {
                'tableId': tableId
            };
            this.checkinService.createCheckForSelectedTable(this.checkObjct).subscribe(createdChecks => {
            });
            this.alreadyCalledForCheck.push(tableId);
        }
    }

    getCheckByTableId(table) {
        this.displayItemTable = this.displayOrderItemTable = false;
        let checkIndex: number;
        this.checksByTableId = undefined;
        this.checkinService.getCheckByTableId().subscribe(checks => {
            this.tableId = table;
            for (checkIndex = 0; checkIndex < checks.length; checkIndex++) {
                if (checks[checkIndex].tableId !== table.id) {
                    checks.splice(checkIndex, 1);
                    checkIndex--;
                }
            }
            this.checksByTableId = checks;
        });
    }

    closeCheckById(checkId) {
        this.checkinService.closeCheck(checkId).subscribe(closeCheckResponse => {
            this.checksByTableId = [closeCheckResponse];
        });
    }

    deleteAllChecks() {
        this.tableId = undefined;
        this.displayItemTable = false;
        this.alreadyCalledForCheck = [];
        this.displayOrderItemTable = false;
        this.itemsList = [];
        this.uncheckAll();
        this.checkinService.deleteAllChecks().subscribe(deleteChecks => {
            console.log('delete checks', deleteChecks);
        });
    }

    getCheckById(checkId) {
        this.displayOrderItemTable = true;
        this.displayItemTable = false;
        this.checkinService.getCheck(checkId).subscribe(getCheckResponse => {
            console.log('here dat', getCheckResponse);
            this.checksByTableId = [getCheckResponse];
            this.orderItems = this.checksByTableId[0].orderedItems;
        });
    }

    getItems() {
        this.displayItemTable = true;
        this.displayOrderItemTable = false;
        this.checkinService.getItems().subscribe(itemResponse => {
            this.itemsList = itemResponse;
        });
    }

    addItemToCheck(itemId) {
        const self = this;
        const itemObj = {
            itemId: itemId
        };
        this.checkinService.addItem(itemObj, this.checksByTableId[0].id).subscribe(itemResponse => {
            self.itemsList.splice(self.itemsList.findIndex(item => {
                // @ts-ignore
                return item.id === itemId;
            }), 1);
        });
    }

    voidAnItem(itemId) {
        const self = this;
        const itemObj = {
            orderedItemId: itemId
        };
        console.log('her', itemId, this.checksByTableId[0].id);
        this.checkinService.voidItem(itemObj, this.checksByTableId[0].id).subscribe(voidItemResponse => {
            self.getCheckById(self.checksByTableId[0].id);
        });
    }

    uncheckAll() {
        this.checkboxes.forEach((element) => {
            element.nativeElement.checked = false;
        });
    }

    resetDisplayItemTable() {
        this.displayItemTable = false;
    }

    resetDisplayOrderItemTable() {
        this.displayOrderItemTable = false;
    }

}
