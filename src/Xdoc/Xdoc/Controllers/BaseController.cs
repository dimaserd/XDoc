using System;
using System.Threading.Tasks;
using Clt.Logic.Abstractions;
using Clt.Logic.Implementations;
using Clt.Logic.Workers.Users;
using Croco.Core.Abstractions.Settings;
using Croco.WebApplication.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Xdoc.Api.Controllers.Base;
using Xdoc.Logic.Extensions;
using Xdoc.Logic.Implementations;
using Xdoc.Logic.Services;
using Xdoc.Model.Contexts;
using Xdoc.Model.Entities.Users.Default;

namespace Xdoc.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Базовый Mvc-контроллер
    /// </summary>
    public class BaseController : CrocoGenericController<XdocDbContext, ApplicationUser>
    {
        #region Конструкторы

        /// <inheritdoc />
        /// <summary>
        /// </summary>
        /// <param name="context"></param>
        /// <param name="userManager"></param>
        /// <param name="signInManager"></param>
        public BaseController(XdocDbContext context, ApplicationUserManager userManager, ApplicationSignInManager signInManager, IHttpContextAccessor httpContextAccessor)
            : base(context, signInManager, userManager, x => x.GetUserId(), httpContextAccessor)
        {

        }
        #endregion

        #region Поля

        /// <summary>
        /// Поле для менеджера ролей
        /// </summary>
        private RoleManager<ApplicationRole> _roleManager;

        #endregion

        #region Свойства

        /// <summary>
        /// Менеджер настроек пользователя
        /// </summary>
        /// <returns></returns>
        protected IUserSettingManager UserSettingManager => new MyApplicationSettingManager(CookieManager, AmbientContext);

        protected ICookieManager CookieManager => new ApplicationCookieManager(HttpContextAccessor);

        /// <summary>
        /// Класс предоставляющий методы для поиска пользователей
        /// </summary>
        protected UserSearcher UserSearcher => new UserSearcher(AmbientContext);


        /// <summary>
        /// Менеджер авторизации
        /// </summary>
        protected IApplicationAuthenticationManager AuthenticationManager => new ApplicationAuthenticationManager(SignInManager);


        /// <summary>
        /// Менеджер для работы с ролями пользователей
        /// </summary>
        protected RoleManager<ApplicationRole> RoleManager => _roleManager ??
                                                           (_roleManager = new RoleManager<ApplicationRole>(new RoleStore<ApplicationRole>(Context), null, null, null, null));

        private ApplicationUser _currentUser;

        protected async Task<ApplicationUser> GetCurrentUserAsync()
        {
            if (_currentUser == null)
            {
                _currentUser = await UserManager.GetUserAsync(User);
            }

            return _currentUser;
        }

        /// <summary>
        /// Идентификатор текущего залогиненного пользователя
        /// </summary>
        protected string UserId => User.Identity.GetUserId();

        #endregion

        protected IActionResult HttpNotFound()
        {
            return StatusCode(404);
        }


        /// <summary>
        /// Вернуть на главную страницу
        /// </summary>
        /// <returns></returns>
        public IActionResult ReturnToMainPage()
        {
            return RedirectToAction("Index", "Home");
        }

        /// <summary>
        /// Показать страница не найдена
        /// </summary>
        /// <returns></returns>
        public ViewResult ShowPageNotFoundPage()
        {
            return View("~/Views/Site/PageNotFound.cshtml");
        }

        /// <inheritdoc />
        /// <summary>
        /// Метод уничтожения объекта Controller
        /// </summary>
        /// <param name="disposing"></param>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                var toDisposes = new IDisposable[]
                {
                    UserManager, Context, _roleManager
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