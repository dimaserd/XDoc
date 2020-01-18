class CrocoAppCore {

    static Application: MyCrocoJsApplication;

    static AjaxLoader: AjaxLoader;

    static ToastrWorker: ToastrWorker;

    static GenericInterfaceHelper: GenericInterfaceAppHelper;

    static GetFormDrawFactory(): FormDrawFactory {
        return new FormDrawFactory({
            DefaultImplementation: x => new FormDrawImplementation(x),
            Implementations: new Map<string, (t: GenerateGenericUserInterfaceModel) => IFormDraw>()
                .set("Default", x => new FormDrawImplementation(x))
                .set("Tab", x => new TabFormDrawImplementation(x))
        })
    }

    static InitFields() {
        CrocoAppCore.Application = new MyCrocoJsApplication();
        CrocoAppCore.AjaxLoader = new AjaxLoader();
        CrocoAppCore.ToastrWorker = new ToastrWorker();
        CrocoAppCore.GenericInterfaceHelper = new GenericInterfaceAppHelper();
        CrocoAppCore.AjaxLoader.InitAjaxLoads();
    }
}