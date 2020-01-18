class FormTypeAfterDrawnDrawer {
    static SetInnerHtmlForProperty(propertyName: string, modelPrefix: string, innerHtml: string): void {
        const elem = FormDrawHelper.GetOuterFormElement(propertyName, modelPrefix);

        console.log("SetInnerHtmlForProperty elem", elem);

        elem.innerHTML = innerHtml;
    }
}