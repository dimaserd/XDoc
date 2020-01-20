using Croco.Core.Application;
using Croco.Core.Extensions;
using Croco.Core.Models;
using Doc.Contract.Models;
using Doc.Contract.Services;
using Doc.Logic.Workers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Xdoc.Api.Controllers.Base;
using Xdoc.Logic.Implementations;
using Xdoc.Logic.Models;
using Xdoc.Logic.Services;
using Xdoc.Logic.Workers;
using Xdoc.Model.Contexts;
using Zoo.Doc.Declension.Models;

namespace Xdoc.Api.Controllers
{
    /// <summary>
    /// Предоставляет методы для работы с документами
    /// </summary>
    [Route("Api/Docs")]
    public class DocsController : BaseApiController
    {
        /// <summary>
        /// Конструктор
        /// </summary>
        /// <param name="context"></param>
        /// <param name="signInManager"></param>
        /// <param name="userManager"></param>
        /// <param name="httpContextAccessor"></param>
        public DocsController(XdocDbContext context, ApplicationSignInManager signInManager, ApplicationUserManager userManager, IHttpContextAccessor httpContextAccessor) : base(context, signInManager, userManager, httpContextAccessor)
        {
        }

        ClientDocsWorker ClientDocsWorker => new ClientDocsWorker(AmbientContext);

        /// <summary>
        /// Получить документы клиента
        /// </summary>
        /// <returns></returns>
        [HttpGet("Client/Get")]
        [ProducesDefaultResponseType(typeof(BaseApiResponse<ClientDocumentsModel>))]
        public Task<BaseApiResponse<ClientDocumentsModel>> GetClientDocuments()
        {
            return ClientDocsWorker.GetClientDocs();
        }

        /// <summary>
        /// Создать или обновить паспорт клиента
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Passport/CreateOrUpdate")]
        [ProducesDefaultResponseType(typeof(BaseApiResponse))]
        public Task<BaseApiResponse> CreateOrUpdateClientPassport([FromForm]RussianFederationPassportModel model)
        {
            return ClientDocsWorker.CreateOrUpdateClientPassport(model);
        }

        /// <summary>
        /// Склонения для человека
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Declension")]
        [ProducesDefaultResponseType(typeof(BaseApiResponse<FullNameDeclension>))]
        public BaseApiResponse<FullNameDeclension> Declension([FromForm]HumanModel model)
        {
            if(model == null)
            {
                return null;
            }

            return FullNameDeclension.GetByHumanModel(model);
        }

        /// <summary>
        /// Распечатать документ
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Print")]
        public BaseApiResponse<string> Print([FromForm]DemoDocumentModel model)
        {
            var fileName = $"Заявление.docx";

            var rootDirPath = CrocoApp.Application.MapPath($"~/wwwroot");

            var filePath = $"Docs/{fileName}";

            var doccer = new DocumentWorker(AmbientContext);

            var t = doccer.RenderDoc(model, $"{rootDirPath}/{filePath}");

            if (!t.IsSucceeded)
            {
                return new BaseApiResponse<string>(t);
            }

            return new BaseApiResponse<string>(t, filePath);
        }
    }
}