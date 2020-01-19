using Croco.Core.Models;
using Croco.Core.Search.Models;
using Croco.WebApplication.Models.Exceptions;
using Croco.WebApplication.Models.Log;
using Croco.WebApplication.Models.Log.Search;
using Croco.WebApplication.Workers.Log;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xdoc.Api.Controllers.Base;
using Xdoc.Logic.Implementations;
using Xdoc.Logic.Services;
using Xdoc.Model.Contexts;
using Xdoc.Model.Entities;
using Zoo.Core;

namespace Xdoc.Api.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Контроллер предоставляющий методы логгирования
    /// </summary>
    [Route("Api/Log")]
    public class LogController : BaseApiController
    {
        /// <inheritdoc />
        public LogController(XdocDbContext context, ApplicationSignInManager signInManager, ApplicationUserManager userManager, IHttpContextAccessor httpContextAccessor) : base(context, signInManager, userManager, httpContextAccessor)
        {
        }

        ExceptionWorker<XDocWebApplication> ExceptionWorker => new ExceptionWorker<XDocWebApplication>(AmbientContext);

        UserInterfaceLogWorker<XDocWebApplication> UserInterfaceLogWorker => new UserInterfaceLogWorker<XDocWebApplication>(AmbientContext);

        LogsSearcher<XDocWebApplication> LogsSearcher => new LogsSearcher<XDocWebApplication>(AmbientContext);

        /// <summary>
        /// Получить исключения на сервере
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("ServerExceptions"), ProducesDefaultResponseType(typeof(GetListResult<LoggedServerException>))]
        public Task<GetListResult<LoggedServerException>> GetServerExceptions(SearchServerActions model)
        {
            return ExceptionWorker.GetServerExceptionsAsync(model);
        }

        /// <summary>
        /// Получить логи на сервере
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("ServerLogs"), ProducesDefaultResponseType(typeof(GetListResult<ServerLog>))]
        public Task<GetListResult<ServerLog>> GetServerLogs(SearchServerActions model) => LogsSearcher.GetServerLogsAsync(model);

        /// <summary>
        /// Получить логи запросов
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Requests"), ProducesDefaultResponseType(typeof(GetListResult<WebAppRequestContextLogWithUserModel>))]
        public Task<GetListResult<WebAppRequestContextLogWithUserModel>> Requests(WebAppRequestContextLogsSearch model)
            => new WebAppRequestContextSearcher<XDocWebApplication>(AmbientContext).GetLogs<Client>(model);

        /// <summary>
        /// Получить логи действий на пользовательском интерфейсе
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("UserInteraceActions"), ProducesDefaultResponseType(typeof(SearchUserInterfaceActionsResult))]
        public Task<SearchUserInterfaceActionsResult> UserInteraceActions(SearchUserInterfaceActions model)
            => UserInterfaceLogWorker.GetUserInterfaceActionsAsync<Client>(model);

        /// <summary>
        /// Получить исключения на пользовательском интерфейсе
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("UserInteraceExceptions"), ProducesDefaultResponseType(typeof(SearchUserInterfaceExceptionsResult))]
        public Task<SearchUserInterfaceExceptionsResult> UserInteraceExceptions(SearchUserInterfaceExceptions model)
            => UserInterfaceLogWorker.GetUserInterfaceExceptions<Client>(model);

        /// <summary>
        /// Залогировать исключения
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Exceptions"), ProducesDefaultResponseType(typeof(BaseApiResponse))]
        public Task<BaseApiResponse> LogExceptions([FromForm]List<LogUserInterfaceException> model)
            => ExceptionWorker.LogUserInterfaceExceptionsAsync(model);

        /// <summary>
        /// Залогировать одно исключение
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Exception"), ProducesDefaultResponseType(typeof(BaseApiResponse))]
        public Task<BaseApiResponse> LogException([FromForm]LogUserInterfaceException model)
            => ExceptionWorker.LogUserInterfaceExceptionAsync(model);


        /// <summary>
        /// Залогировать одно событие или действие
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Action"), ProducesDefaultResponseType(typeof(BaseApiResponse))]
        public Task<BaseApiResponse> LogAction([FromForm]LoggedUserInterfaceActionModel model)
            => UserInterfaceLogWorker.LogActionAsync(model);
    }
}
