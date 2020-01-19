using Croco.Core.Abstractions;
using Croco.Core.Models;
using Doc.Contract.Models;
using Doc.Logic.Entities;
using System;
using System.Collections.Generic;
using Xdoc.Logic.Workers;
using Zoo.Doc.Declension.Enumerations;
using Zoo.Doc.Declension.Models;
using Zoo.Doc.WordGen.Implementations;
using Zoo.Doc.WordGen.Models;
using Zoo.Doc.WordGen.Workers;

namespace Doc.Logic.Workers
{
    public class DocumentWorker : XDocBaseWorker
    {
        public DocumentWorker(ICrocoAmbientContext context) : base(context)
        {
        }

        static BaseApiResponse ValidateDemoModel(DemoDocumentModel model)
        {
            if (model.ToDate <= model.FromDate)
            {
                return new BaseApiResponse(false, "Дата окончания отпуска должна быть больше даты начала отпуска");
            }

            return new BaseApiResponse(true, "Ok");
        }


        public BaseApiResponse RenderDoc(DemoDocumentModel model, string docSaveFileName)
        {
            var validation = ValidateModel(model);

            if (!validation.IsSucceeded)
            {
                return validation;
            }

            validation = ValidateDemoModel(model);

            if (!validation.IsSucceeded)
            {
                return validation;
            }
            var docTemplate = Application.MapPath("~/wwwroot/DocTemplates/Document.docx");

            return RenderDocForPurchase(model, docSaveFileName, docTemplate);
        }

        static string ToStr(DateTime date) => date.Date.ToString("mm.dd.YYYY");

        public static BaseApiResponse RenderDocForPurchase(DemoDocumentModel model, string docSaveFileName, string docTemplate)
        {

            var humanDecl = FullNameDeclension.GetByHumanModel(new HumanModel
            {
                FirstName = model.Name,
                LastName = model.LastName,
                Patronymic = model.Patronymic
            });

            var days = (model.ToDate.Date - model.FromDate.Date).TotalDays;

            var docModel = new DocXDocumentObjectModel
            {
                Replaces = new Dictionary<string, string>
                {
                    ["{FromName}"] = $"{humanDecl.LastName.GetByWordCase(WordCase.Р)} {humanDecl.FirstName.GetByWordCase(WordCase.Р)} {humanDecl.Patronymic.GetByWordCase(WordCase.Р)}".Trim(),
                    ["{Text}"] = $"Прошу предоставить мне ежегодный оплачиваемый отпуск с {ToStr(model.FromDate)} по {ToStr(model.ToDate)} на {days} дней",
                },

                Tables = new List<DocumentTable>(),

                DocumentTemplateFileName = docTemplate,

                ToReplaceImages = new List<DocxImageReplace>(),

                DocumentSaveFileName = docSaveFileName,
            };

            var proccessor = new WordDocumentProcessor(new WordDocumentProcessorOptions
            {
                Engine = new DocOpenFormatWordEngine()
            });

            return proccessor.RenderDocument(docModel);
        }
    }
}