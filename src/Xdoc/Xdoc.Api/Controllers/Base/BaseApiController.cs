using Clt.Logic.Abstractions;
using Clt.Logic.Implementations;
using Croco.Core.Abstractions.Settings;
using Croco.Core.Application;
using Croco.WebApplication.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Xdoc.Logic.Implementations;
using Xdoc.Logic.Services;
using Xdoc.Model.Contexts;
using Xdoc.Model.Entities.Users.Default;

namespace CrocoShop.Api.Controllers.Base
{
    /// <inheritdoc />
    /// <summary>
    /// Базовый абстрактный контроллер в котором собраны общие методы и свойства
    /// </summary>
    public class BaseApiController : CrocoGenericController<XdocDbContext, ApplicationUser>
    {
        /// <inheritdoc />
        public BaseApiController(XdocDbContext context, ApplicationSignInManager signInManager, ApplicationUserManager userManager, IHttpContextAccessor httpContextAccessor) : base(context, signInManager, userManager, x => x.Identity.GetUserId(), httpContextAccessor)
        {
        }

        #region Поля

        /// <summary>
        /// Менеджер ролей
        /// </summary>
        public RoleManager<ApplicationRole> RoleManager = null;
        #endregion

        #region Свойства

        /// <summary>
        /// Менеджер настроек пользователя
        /// </summary>
        /// <returns></returns>
        protected IUserSettingManager UserSettingManager => new MyApplicationSettingManager(CookieManager, AmbientContext);

        /// <summary>
        /// Менеджер для работы с куками
        /// </summary>
        protected ICookieManager CookieManager => new ApplicationCookieManager(HttpContextAccessor);
        
        /// <summary>
        /// Менеджер авторизации
        /// </summary>
        protected IApplicationAuthenticationManager AuthenticationManager => new ApplicationAuthenticationManager(SignInManager); 

        #endregion
        
        /// <inheritdoc />
        /// <summary>
        /// Удаление объекта из памяти
        /// </summary>
        /// <param name="disposing"></param>
        protected override void Dispose(bool disposing)
        {
            //Логгируем контекст запроса
            CrocoApp.Application.RequestContextLogger.LogRequestContext(RequestContext);

            if (RoleManager != null)
            {
                RoleManager.Dispose();
                RoleManager = null;
            }
            base.Dispose(disposing);
        }
    }
}