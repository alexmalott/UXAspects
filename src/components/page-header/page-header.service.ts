import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { filter, map } from 'rxjs/operators';
import { PageHeaderNavigationDropdownItem, PageHeaderNavigationItem } from './navigation/navigation.component';

@Injectable()
export class PageHeaderService implements OnDestroy {

    items$ = new BehaviorSubject<PageHeaderNavigationItem[]>([]);
    selected$ = new BehaviorSubject<PageHeaderNavigationItem>(null);
    selectedRoot$ = new BehaviorSubject<PageHeaderNavigationItem>(null);
    secondary$ = new BehaviorSubject<boolean>(false);

    private _subscription: Subscription;

    constructor() {
        this._subscription = this.selected$.pipe(map(selected => this.getRoot(selected))).subscribe(root => this.selectedRoot$.next(root));
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    select(item: PageHeaderNavigationItem): void {

        // do nothing if this item is already selected
        if (item === this.selected$.getValue()) {
            return;
        }

        // deselect all current items
        this.deselectAll();

        // call the select function if present
        if (item.select) {
            item.select.call(item, item);
        }

        // store the selected state
        item.selected = true;

        // select all parent items too
        this.selectParents(item);

        // emit the new selected item
        this.selected$.next(item);
    }

    deselect(item: PageHeaderNavigationItem | PageHeaderNavigationDropdownItem): void {

        // deselect the current item
        item.selected = false;

        // iterate any children and deselect them
        if (item.children) {
            item.children.forEach(_item => this.deselect(_item));
        }
    }

    deselectAll(): void {
        this.items$.getValue().forEach(item => this.deselect(item));
    }

    setItems(items: PageHeaderNavigationItem[] = []): void {
        // identify all parent elements
        items.forEach(item => this.setParent(item));

        this.items$.next(items);
    }

    setSecondaryNavigation(enabled: boolean): void {
        this.secondary$.next(enabled);
    }

    private getRoot(item: PageHeaderNavigation): PageHeaderNavigation {
        return item && item.parent ? this.getRoot(item.parent) : item;
    }

    private setParent(item: PageHeaderNavigation, parent?: PageHeaderNavigation | null): void {
        // set the parent field
        item.parent = parent;

        // call this function recursively on all children
        if (item.children) {
            item.children.forEach(child => this.setParent(child, item));
        }
    }

    private selectParents(item: PageHeaderNavigation): void {
        // if there is a parent then we want to set it to selected
        if (item.parent) {
            item.parent.selected = true;

            // check if it has any parents
            this.selectParents(item.parent);
        }
    }
}

export type PageHeaderNavigation = PageHeaderNavigationItem | PageHeaderNavigationDropdownItem;