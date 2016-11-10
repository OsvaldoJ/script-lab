import { Component, OnDestroy, HostListener, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Dictionary } from '@microsoft/office-js-helpers';
import { Subscription } from 'rxjs/Subscription';
import { Monaco, Snippet } from '../../services';
import { MonacoEditorTab } from './monaco-editor-tab';

@Component({
    selector: 'monaco-editor-tabs',
    template: `
    <ul class="tabs ms-Pivot ms-Pivot--tabs">
        <li class="tabs__tab ms-Pivot-link" *ngFor="let tab of values()" (click)="select(tab)" [ngClass]="{'is-selected tabs__tab--active': tab.active}">
            {{tab.alias||tab.name}}
        </li>
    </ul>
    <div class="tabs__container">
        <section #editor class="monaco-editor"></section>
    </div>`,
    styleUrls: ['monaco-editor.component.scss']
})
export class MonacoEditorTabs extends Dictionary<MonacoEditorTab> implements AfterViewInit, OnDestroy {
    private _subscriptions: Subscription[] = [];
    private _monacoEditor: monaco.editor.IStandaloneCodeEditor;

    selectedTab: MonacoEditorTab;
    @ViewChild('editor') private _editor: ElementRef;
    @Input() readonly: boolean;

    constructor(private _monaco: Monaco) {
        super();
    }

    ngAfterViewInit() {
        this._monaco.create(this._editor).then(monacoEditor => this._monacoEditor = monacoEditor);
    }

    ngOnDestroy() {
        this._subscriptions.forEach(subscription => {
            if (!subscription.closed) {
                subscription.unsubscribe();
            }
        });

        if (this._monacoEditor) {
            this._monacoEditor.dispose();
        }
    }

    // private _initializeMonacoEditor(): void {
    // $(this._editor.nativeElement).keydown(event => {
    //     if ((event.ctrlKey || event.metaKey) && event.which === 83) {
    //         event.preventDefault();
    //         return false;
    //     }
    // });
    // }

    get snippet(): ISnippet {
        if (!this._monacoEditor) {
            return null;
        }

        let snippet: ISnippet = {};

        this.selectedTab.view = this._getCurrentTabState();
        this.values().forEach(tab => {
            let name = tab.name.toLowerCase();
            switch (name) {
                case 'libraries':
                    snippet.libraries = tab.content.split('\n');
                    break;

                case 'readme':
                    snippet.readme = tab.content;
                    break;

                default:
                    snippet[name] = {
                        content: tab.content,
                        language: tab.language
                    };
                    break;
            }
        });

        return snippet;
    }

    add(name: string, tab: MonacoEditorTab) {
        let subscription = tab.channel.source$.subscribe(view => {
            if (view == null) {
                return;
            }

            if (this.selectedTab.name === view.name) {
                this._updateEditor(this.selectedTab);
            }
        });

        this._subscriptions.push(subscription);
        super.add(tab.name, tab);

        if (this.count === 1) {
            this.select(tab);
        }

        return tab;
    }

    select(tab: MonacoEditorTab) {
        // appInsights.trackEvent('Switch editor tabs', { type: 'UI Action', name: tab.name });
        let currentTab = null;
        this.values().forEach(tab => {
            if (tab.active) {
                currentTab = tab;
            }
            tab.active = false;
        });

        tab.active = true;
        this.selectedTab = tab;
        this._updateEditor(tab, currentTab);
    }

    @HostListener('window:resize', ['$event'])
    resize() {
        if (this._monacoEditor) {
            this._monacoEditor.layout();
            this._monacoEditor.setScrollTop(0);
            this._monacoEditor.setScrollLeft(0);
        }
    }

    private _updateEditor(nextTab: MonacoEditorTab, currentTab?: MonacoEditorTab) {
        if (this._monacoEditor == null) {
            return;
        }

        if (!(currentTab == null)) {
            currentTab.view = this._getCurrentTabState();
        }

        if (nextTab.view.model == null) {
            // If this is the first time we are switching to this tab
            // then create a new model and save that.
            let newModel = monaco.editor.createModel(nextTab.content, nextTab.language);
            nextTab.view.model = newModel;
        }

        this._monacoEditor.setModel(nextTab.view.model);
        this._monacoEditor.restoreViewState(nextTab.view.state);
        this._monacoEditor.focus();
    }

    private _getCurrentTabState(): IMonacoEditorState {
        return {
            name: this.selectedTab.name,
            content: this._monacoEditor.getValue(),
            model: this._monacoEditor.getModel(),
            state: this._monacoEditor.saveViewState()
        };
    }
}