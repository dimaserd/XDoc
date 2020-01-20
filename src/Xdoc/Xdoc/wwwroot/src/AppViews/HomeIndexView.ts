interface DemoDocumentModel {
    Name: string;
    LastName: string;
    Patronymic: string;
    FromDate: Date;
    ToDate: Date;
}

class HomeIndexView {
    modelPrefix: string = "somePrefix";

    typeDescription: CrocoTypeDescription;

    constructor() {
        this.SetHandlers();
    }

    public SetHandlers(): void {
        
        CrocoAppCore.GenericInterfaceHelper.GetUserInterfaceModel("DemoDocumentModel", this.modelPrefix, (x => {

            this.typeDescription = x.TypeDescription;

            //Метод отрисовки
            CrocoAppCore.GenericInterfaceHelper.FormHelper.DrawForm({
                ElementId: "form-id", //Идентификатор элемента, куда будет вставлена разметка с интерфейсом
                FormDrawKey: null, //Ключ по-которому указывается тип отрисовки (если null, то берётся по-умолчанию)
                FormModel: x //Передаю модель описывающую сам интерфейс
            });
        }).bind(this));

        document.getElementById("create-doc-btn").addEventListener("click", (() => this.RenderDocument()).bind(this));

        let url = `${window.location.origin}/DocTemplates/DemoDoc.docx`;

        document.getElementById("doc-template-preview").innerHTML = `<iframe src='https://view.officeapps.live.com/op/embed.aspx?src=${url}' style="width:100%;height:100%" frameborder='0'></iframe>`;

        (document.getElementById("download-template-btn") as HTMLAnchorElement).href = url;
    }

    public RenderDocument(): void {

        let data = CrocoAppCore.Application.FormDataHelper
            .CollectDataByPrefixWithTypeMatching(this.modelPrefix, this.typeDescription);

        console.log("RenderDocument", data);

        CrocoAppCore.Application.Requester.SendPostRequestWithAnimation<IGenericBaseApiResponse<string>>("/Api/Docs/Print", data, x => {

            if (!x.IsSucceeded) {
                return;
            }

            let a = document.getElementById("download-result-btn") as HTMLAnchorElement;

            a.href = x.ResponseObject;

            let url = `${window.location.origin}/${x.ResponseObject}`;

            console.log(url);

            document.getElementById("doc-frame").innerHTML = `<iframe src='https://view.officeapps.live.com/op/embed.aspx?src=${url}' style="width:100%;height:100%" frameborder='0'></iframe>`;

            $("#create-doc-form").fadeOut();
            $("#create-doc-result").fadeIn();

            console.log(x);
        }, null);
    }
}

class AutoFill {
    static FillForm(): void {
        let m: DemoDocumentModel = {
            ToDate: new Date(),
            FromDate: new Date(),
            Name: "Дмитрий",
            LastName: "Сердюков",
            Patronymic: "Александрович"
        };

        let prefix = "somePrefix";

        CrocoAppCore.Application.FormDataHelper.FillDataByPrefix(m, prefix);

        //somePrefix_FromDateFakeCalendar
        var elem = (document.getElementById(prefix + "_FromDateFakeCalendar") as HTMLInputElement);
        elem.value = '07/01/2020';
        var event = new Event('change');
        elem.dispatchEvent(event);

        elem = (document.getElementById(prefix + "_ToDateFakeCalendar") as HTMLInputElement);
        elem.value = '20/01/2020';
        var event = new Event('change');
        elem.dispatchEvent(event);
    }
}
new HomeIndexView();