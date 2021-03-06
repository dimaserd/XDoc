﻿using Clt.Contract.Models.Account;
using Clt.Logic.Models;
using Clt.Logic.Models.Account;
using Clt.Logic.Workers.Accounts;
using Croco.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Xdoc.Api.Controllers.Base;
using Xdoc.Logic.Services;
using Xdoc.Model.Contexts;

namespace Xdoc.Api.Controllers
{
    /// <summary>
    /// Предоставляет методы для работы с учетной записью а также логгинирование
    /// </summary>
    [Route("Api/Account")]
    public class AccountController : BaseApiController
    {
        /// <summary>
        /// Конструктор
        /// </summary>
        /// <param name="context"></param>
        /// <param name="signInManager"></param>
        /// <param name="userManager"></param>
        /// <param name="httpContextAccessor"></param>
        public AccountController(XdocDbContext context, ApplicationSignInManager signInManager, ApplicationUserManager userManager, IHttpContextAccessor httpContextAccessor) : base(context, signInManager, userManager, httpContextAccessor)
        {
        }

        AccountLoginWorker AccountLoginWorker => new AccountLoginWorker(AmbientContext);

        AccountRegistrationWorker AccountRegistrationWorker => new AccountRegistrationWorker(AmbientContext);

        #region Методы логинирования

        /// <summary>
        /// Войти по Email
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Login/ByEmail")]
        [ProducesDefaultResponseType(typeof(BaseApiResponse<LoginResultModel>))]
        public Task<BaseApiResponse<LoginResultModel>> Login([FromForm]LoginModel model)
        {
            return AccountLoginWorker.LoginAsync(model, SignInManager);
        }

        /// <summary>
        /// Войти по номеру телефона
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Login/ByPhone")]
        [ProducesDefaultResponseType(typeof(BaseApiResponse<LoginResultModel>))]
        public Task<BaseApiResponse<LoginResultModel>> LoginByPhone([FromForm]LoginByPhoneNumberModel model)
        {
            return AccountLoginWorker.LoginByPhoneNumberAsync(model, SignInManager);
        }

        #endregion

        #region Методы регистрации

        /// <summary>
        /// Зарегистрироваться и войти
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("RegisterAndSignIn")]
        [ProducesDefaultResponseType(typeof(BaseApiResponse<ClientModel>))]
        public Task<BaseApiResponse<ClientModel>> RegisterAndSignIn([FromForm]RegisterModel model)
        {
            return AccountRegistrationWorker.RegisterAndSignInAsync(model, UserManager, SignInManager);
        }

        /// <summary>
        /// Зарегистрироваться
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Register")]
        [ProducesDefaultResponseType(typeof(BaseApiResponse<ClientModel>))]
        public Task<BaseApiResponse<ClientModel>> Register([FromForm]RegisterModel model)
        {
            return AccountRegistrationWorker.RegisterAsync(model, UserManager);
        }
        #endregion

        
        /// <summary>
        /// Разлогиниться в системе
        /// </summary>
        /// <returns></returns>
        [HttpPost("LogOut")]
        [ProducesDefaultResponseType(typeof(BaseApiResponse))]
        public BaseApiResponse LogOut()
        {
            return AccountLoginWorker.LogOut(AuthenticationManager);
        }
    }
}
