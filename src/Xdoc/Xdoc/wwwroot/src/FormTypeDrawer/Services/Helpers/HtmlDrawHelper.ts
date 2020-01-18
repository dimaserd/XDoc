class HtmlDrawHelper {

    static RenderInput(type: string, attrs: Map<string, string>): string {
        let attrString = HtmlDrawHelper.RenderAttributesString(attrs);

        return `<input type=${type} ${attrString}/>`;
    }

    static RenderAttributesString(attrs: Map<string, string>): string {

        let result = "";

        if (attrs == null) {
            return result;
        }

        //Итерация по ключам в map
        for (let key of Array.from(attrs.keys())) {

            let res = attrs.get(key);

            if (res == null || res === "") {
                result += ` ${key}`;
            }                                                                                                     
            else {
                result += ` ${key}="${res}"`;
            }
        }

        return result;
    }

    static RenderSelect(className: string, propName: string, selectList: SelectListItem[], attrs: Map<string, string>): string {

        let attrStr = HtmlDrawHelper.RenderAttributesString(attrs);

        var select = `<select${attrStr} class="${className}" name="${propName}">`;

        for (let i = 0; i < selectList.length; i++) {
            var item = selectList[i];
            var selected = item.Selected ? ` selected="selected"` : '';
            select += `<option${selected} value="${item.Value}">${item.Text}</option>`;
        }
        select += `</select>`;


        return select;
    }
}