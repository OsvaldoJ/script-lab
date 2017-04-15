import { Utilities, HostType } from '@microsoft/office-js-helpers';

Office.initialize = () => {
    const urls = {
        //tutorial: `${window.location.origin}/assets/documents/script-lab-tutorial.xlsx`,
        tutorial: `${window.location.origin}/tutorial.html`,
        playground_help: 'https://github.com/OfficeDev/script-lab/blob/master/README.md',
        feedback: 'https://github.com/OfficeDev/script-lab/issues',
        ask: 'https://stackoverflow.com/questions/tagged/office-js',
        excel_api: 'https://dev.office.com/docs/add-ins/excel/excel-add-ins-javascript-programming-overview',
        word_api: 'https://dev.office.com/reference/add-ins/word/word-add-ins-reference-overview',
        onenote_api: 'https://dev.office.com/docs/add-ins/onenote/onenote-add-ins-programming-overview',
        powepoint_api: 'https://dev.office.com/docs/add-ins/powerpoint/powerpoint-add-ins',
        project_api: 'https://dev.office.com/reference/add-ins/shared/projectdocument.projectdocument',
        generic_api: 'https://dev.office.com/reference/add-ins/javascript-api-for-office'
    };
    /*
        const launch = (url: string, event?: any) => {
            window.open(url);
            if (event) {
                event.completed();
            }
        };
        const launchFromDialog = (url: string, event?: any) => {
            let dialog;
            Office.context.ui.displayDialogAsync(`${window.location.origin}/webpagelauncher.html?destination=${url}`, { height: 1, width: 1 }, (asyncResult) => {
                dialog = asyncResult.value;
                dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
                    dialog.close();
                    // arg.message
                });
            });
            if (event) {
                event.completed();
            }
        };
    */
    const launchInDialog = (url: string, event?: any, x?: number, y?: number) => {
        let myOptions = null;
        if (x && y) {
            myOptions = { height: y, width: x };
        }

        Office.context.ui.displayDialogAsync(url, myOptions, null);

        if (event) {
            event.completed();
        }
    };
    const launchDialogNavigation = (url: string, event?: any, x?: number, y?: number) => {
        let myOptions = null;
        if (x && y) {
            myOptions = { height: y, width: x };
        }

        Office.context.ui.displayDialogAsync(`${window.location.origin}/externalpagedisplay.html?destination=${url}`, myOptions, null);

        if (event) {
            event.completed();
        }
    };

    (window as any).launchTutorial = (event) => launchInDialog(urls.tutorial, event, 35, 45);

    (window as any).launchHelp = (event) => launchInDialog(urls.playground_help, event, 60, 60);

    (window as any).launchFeedback = (event) => launchInDialog(urls.feedback, event, 60, 60);

    (window as any).launchAsk = (event) => launchDialogNavigation(urls.ask, event, 60, 60);

    (window as any).launchApiDocs = (event) => {
        if (Office.context.requirements.isSetSupported('ExcelApi')) {
            return launchDialogNavigation(urls.excel_api, event, 60, 60);
        }
        else if (Office.context.requirements.isSetSupported('WordApi')) {
            return launchDialogNavigation(urls.word_api, event, 60, 60);
        }
        else if (Office.context.requirements.isSetSupported('OneNoteApi')) {
            return launchDialogNavigation(urls.onenote_api, event, 60, 60);
        }
        else {
            if (Utilities.host === HostType.POWERPOINT) {
                return launchDialogNavigation(urls.powepoint_api, event, 60, 60);
            }
            else if (Utilities.host === HostType.PROJECT) {
                return launchDialogNavigation(urls.project_api, event, 60, 60);
            }
            else {
                return launchDialogNavigation(urls.generic_api, event, 60, 60);
            }
        }
    };
};
