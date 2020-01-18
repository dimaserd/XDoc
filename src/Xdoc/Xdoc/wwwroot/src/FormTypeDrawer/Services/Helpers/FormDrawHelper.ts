class FormDrawHelper {

    static FormPropertyName = "form-property-name";
    static FormModelPrefix = "form-model-prefix";

    static GetPropertyValueName(propertyName: string, modelPrefix: string): string {
        return `${modelPrefix}${propertyName}`;
    }

    static GetOuterFormElement(propertyName: string, modelPrefix: string): Element {
        return document.querySelector(`[${FormDrawHelper.FormPropertyName}="${propertyName}"][${FormDrawHelper.FormModelPrefix}="${modelPrefix}"]`);
    }

    static GetOuterFormAttributes(propertyName: string, modelPrefix: string): string {
        return `${FormDrawHelper.FormPropertyName}="${propertyName}" ${FormDrawHelper.FormModelPrefix}="${modelPrefix}"`;
    }

    static GetInputTypeHidden(propName: string, value: string, otherProps: Map<string, string> = null) {

        let t = otherProps != null ? otherProps : new Map<string, string>();
        
        t.set("value", value);
        t.set("name", propName);
        return HtmlDrawHelper.RenderInput("hidden", t);
    }
}