using Clt.Logic.Abstractions;
using Clt.Logic.Implementations;
using Croco.Core.ContextWrappers;
using Croco.WebApplication.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using Xdoc.Logic.Extensions;
using Xdoc.Logic.Implementations;
using Xdoc.Logic.Services;
using Xdoc.Model.Contexts;

namespace Xdoc.Api.Controllers.Base
{
    /// <inheritdoc />
    /// <summary>
    /// Базовый абстрактный контроллер в котором собраны общие методы и свойства
    /// </summary>
    public class BaseApiController : Controller
    {
        /// <inheritdoc />
        public BaseApiController(XdocDbContext context, ApplicationSignInManager signInManager, ApplicationUserManager userManager, IHttpContextAccessor httpContextAccessor)
        {
            Context = context;
            SignInManager = signInManager;
            UserManager = userManager;
            HttpContextAccessor = httpContextAccessor;
        }

        #region Поля

        //TODO Impelement RoleManager
        /// <summary>
        /// Менеджер ролей
        /// </summary>
        public RoleManager<IdentityRole> RoleManager = null;

        private UserContextWrapper<XdocDbContext> _contextWrapper;
        #endregion

        #region Свойства

        /// <summary>
        /// Менеджер для работы с куками
        /// </summary>
        protected ICookieManager CookieManager => new ApplicationCookieManager(HttpContextAccessor);

        /// <summary>
        /// Менеджер авторизации
        /// </summary>
        protected IApplicationAuthenticationManager AuthenticationManager => new ApplicationAuthenticationManager(SignInManager);

        /// <summary>
        /// Контекст для работы с бд
        /// </summary>
        public XdocDbContext Context
        {
            get;
        }

        /// <summary>
        /// Обёртка для контекста
        /// </summary>
        public UserContextWrapper<XdocDbContext> ContextWrapper => _contextWrapper ?? (_contextWrapper = new UserContextWrapper<XdocDbContext>(User, Context, x => x.Identity.GetUserId()));

        /// <summary>
        /// Менеджер авторизации
        /// </summary>
        public ApplicationSignInManager SignInManager
        {
            get;
            set;
        }

        /// <summary>
        /// Менеджер для работы с пользователями
        /// </summary>
        public ApplicationUserManager UserManager
        {
            get;
            set;
        }

        /// <summary>
        /// Контекст доступа к запросу
        /// </summary>
        public IHttpContextAccessor HttpContextAccessor { get; }


        /// <summary>
        /// Идентификатор текущего залогиненного пользователя
        /// </summary>
        protected string UserId => User.Identity.GetUserId();

        #endregion

        /// <inheritdoc />
        /// <summary>
        /// Удаление объекта из памяти
        /// </summary>
        /// <param name="disposing"></param>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                var toDisposes = new IDisposable[]
                {
                    UserManager, Context
                };

                for (var i = 0; i < toDisposes.Length; i++)
                {
                    if (toDisposes[i] == null)
                    {
                        continue;
                    }

                    toDisposes[i].Dispose();
                    toDisposes[i] = null;
                }
            }

            base.Dispose(disposing);
        }
    }

}
