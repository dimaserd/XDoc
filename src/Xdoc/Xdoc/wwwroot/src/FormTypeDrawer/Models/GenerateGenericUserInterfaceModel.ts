interface GenerateGenericUserInterfaceModel {
    /**
     * Префикс является уникальным на одной странице
     * */
    Prefix: string;
    TypeDescription: CrocoTypeDescription;
    Blocks: UserInterfaceBlock[];
    ValueProvider: GenericUserInterfaceValueProvider;
}
