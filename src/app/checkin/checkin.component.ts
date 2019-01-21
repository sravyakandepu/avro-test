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
    private tempItemsList: [] = [];
    private checkWiseItemList: [] = [];
    private displayItemTable: boolean;
    private displayOrderItemTable: boolean;
    private closedCheck: any;

    constructor(private checkinService: CheckinService) {
    }

    tableData: [] = [];
    private checkObjct: { tableId: string };
    tableId: any;
    checksByTableId: any = [];
    alreadyCalledForCheck = [];

    @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;

    ngOnInit() {
        this.getTables();
    }

    getTables(): void {
        const self = this;
        this.checkinService.getTables().subscribe(tables => {
            this.tableData = tables;
            this.checkinService.getItems().subscribe(itemResponse => {
                self.tempItemsList = itemResponse;
            });
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

    getCheckByTableId(table, isClickOnView) {
        this.displayItemTable = this.displayOrderItemTable = false;
        let checkIndex: number;
        this.checksByTableId = [];
        this.orderItems = [];
        this.closedCheck = undefined;
        this.checkinService.getCheckByTableId().subscribe(checks => {
            this.tableId = table;
            for (checkIndex = 0; checkIndex < checks.length; checkIndex++) {
                const checkWiseItem: object = {
                    checkId: checks[checkIndex].id,
                    itemList: this.tempItemsList.concat()
                };
                let isCheckPresent = false;
                for (let index = 0; index < this.checkWiseItemList.length; index++) {
                    // @ts-ignore
                    if (this.checkWiseItemList[index].checkId === checks[checkIndex].id) {
                        isCheckPresent = true;
                        break;
                    }
                }
                if (!isCheckPresent) {
                    // @ts-ignore
                    this.checkWiseItemList.push(checkWiseItem);
                }

                if (checks[checkIndex].tableId !== table.id) {
                    checks.splice(checkIndex, 1);
                    checkIndex--;
                } else if (isClickOnView && checks[checkIndex].closed) {
                    checks.splice(checkIndex, 1);
                    checkIndex--;
                }
            }
            this.checksByTableId = checks;
            if (this.orderItems.length) {
                // @ts-ignore
                for (let orderItemIndex = 0; orderItemIndex < this.orderItems.length; orderItemIndex++) {
                    // @ts-ignore
                    this.tempItemsList.map((item) => {
                        // @ts-ignore
                        if (item.id === this.orderItems[orderItemIndex].itemId) {
                            // @ts-ignore
                            this.orderItems[orderItemIndex].name = item.name;
                        }
                    });
                }
            }
        });
    }

    closeCheckById(checkId) {
        this.displayOrderItemTable = false;
        this.checkinService.closeCheck(checkId).subscribe(closeCheckResponse => {
            for (let index = 0; index < this.checksByTableId.length; index++) {
                if (this.checksByTableId[index].id === closeCheckResponse.id) {
                    this.checksByTableId[index] = closeCheckResponse;
                    this.closedCheck = closeCheckResponse;
                }
            }
        });
    }

    deleteAllChecks() {
        this.tableId = undefined;
        this.displayItemTable = false;
        this.alreadyCalledForCheck = [];
        this.displayOrderItemTable = false;
        this.itemsList = [];
        this.checkWiseItemList = [];
        this.uncheckAll();
        this.checkinService.deleteAllChecks().subscribe(deleteChecks => {
        });
    }

    getCheckById(checkId) {
        this.displayOrderItemTable = true;
        this.displayItemTable = false;
        this.closedCheck = undefined;
        this.checkinService.getCheck(checkId).subscribe(getCheckResponse => {
            let tempResponse = [getCheckResponse];
            for (let index = 0; index < this.checksByTableId.length; index++) {
                if (this.checksByTableId[index].id === getCheckResponse.id) {
                    this.checksByTableId[index] = getCheckResponse;
                }
            }
            for (let orderItemIndex = 0; orderItemIndex < tempResponse[0].orderedItems.length; orderItemIndex++) {
                this.tempItemsList.map((item) => {
                    // @ts-ignore
                    if (item.id === tempResponse[0].orderedItems[orderItemIndex].itemId) {
                        // @ts-ignore
                        tempResponse[0].orderedItems[orderItemIndex].name = item.name;
                    }
                });
            }
            for (let index = 0; index < this.checksByTableId.length; index++) {
                // @ts-ignore
                if (this.checksByTableId[index].id === tempResponse.id) {
                    this.checksByTableId[index] = tempResponse;
                }
            }
            this.closedCheck = tempResponse[0];
            console.log('checksByTableId.length', this.closedCheck)
            this.orderItems = tempResponse[0].orderedItems.reverse();
        });
    }

    getItems() {
        this.displayItemTable = true;
        this.displayOrderItemTable = false;
        this.itemsList = [];
        this.checkWiseItemList.map((itemObj) => {
            // @ts-ignore
            if (itemObj.checkId === this.checksByTableId[0].id) {
                // @ts-ignore
                this.itemsList.push.apply(this.itemsList, itemObj.itemList);
            }
        });
    }

    addItemToCheck(itemId) {
        const self = this;
        const itemObj = {
            itemId: itemId
        };
        this.checkinService.addItem(itemObj, this.checksByTableId[0].id).subscribe(itemResponse => {
        });
    }

    voidAnItem(itemId) {
        const self = this;
        const itemObj = {
            orderedItemId: itemId
        };
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
