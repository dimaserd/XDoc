﻿using Croco.Core.Common.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Xdoc.Api.Controllers.Base;
using Xdoc.Logic.Models;
using Xdoc.Logic.Services;
using Xdoc.Logic.Workers;
using Xdoc.Model.Contexts;

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

        private ClientDocsWorker ClientDocsWorker => new ClientDocsWorker(ContextWrapper);

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


    }
}