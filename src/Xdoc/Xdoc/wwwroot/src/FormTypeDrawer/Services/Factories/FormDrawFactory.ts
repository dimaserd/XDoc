interface FormDrawFactoryOptions {
    DefaultImplementation: (t: GenerateGenericUserInterfaceModel) => IFormDraw;
    Implementations: Map<string, (t: GenerateGenericUserInterfaceModel) => IFormDraw>;
}

class FormDrawFactory {

    _defaultImplementation: (t: GenerateGenericUserInterfaceModel) => IFormDraw; 
    _implementations: Map<string, (t: GenerateGenericUserInterfaceModel) => IFormDraw>;

    constructor(opts: FormDrawFactoryOptions) {
        this._defaultImplementation = opts.DefaultImplementation;
        this._implementations = opts.Implementations;
    }

    GetImplementation(buildModel: GenerateGenericUserInterfaceModel, key: string): IFormDraw {

        var func = this._implementations.get(key);

        if (func == null) {
            return this._defaultImplementation(buildModel);
        }

        return func(buildModel);
    }
}