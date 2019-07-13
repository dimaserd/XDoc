using Clt.Contract.Models.Account;
using Clt.Logic.Abstractions;
using Clt.Logic.Models.Account;
using Clt.Logic.Workers.Users;
using Croco.Core.Abstractions.ContextWrappers;
using Croco.Core.Common.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xdoc.Logic.Workers;
using Xdoc.Model.Contexts;
using Xdoc.Model.Entities.Users.Default;

namespace Clt.Logic.Workers.Accounts
{
    public class AccountLoginWorker : XDocBaseWorker
    {
        public async Task<BaseApiResponse<LoginResultModel>> LoginByPhoneNumberAsync(LoginByPhoneNumberModel model, SignInManager<ApplicationUser> signInManager)
        {
            var validation = ValidateModel(model);

            if (!validation.IsSucceeded)
            {
                return new BaseApiResponse<LoginResultModel>(validation);
            }

            var searcher = new UserSearcher(ApplicationContextWrapper);

            var user = await searcher.GetUserByPhoneNumberAsync(model.PhoneNumber);

            if (user == null)
            {
                return new BaseApiResponse<LoginResultModel>(false, "Пользователь не найден по указанному номеру телефона");
            }

            return await LoginAsync(new LoginModel(model, user.Email), signInManager);
        }

        public async Task<BaseApiResponse<LoginResultModel>> LoginAsync(LoginModel model, SignInManager<ApplicationUser> signInManager)
        {
            var validation = ValidateModel(model);

            if (!validation.IsSucceeded)
            {
                return new BaseApiResponse<LoginResultModel>(validation);
            }

            if (ContextWrapper.IsAuthenticated)
            {
                return new BaseApiResponse<LoginResultModel>(false, "Вы уже авторизованы в системе", new LoginResultModel { Result = LoginResult.AlreadyAuthenticated });
            }

            model.RememberMe = true;

            var user = await signInManager.UserManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                return new BaseApiResponse<LoginResultModel>(false, "Неудачная попытка входа", new LoginResultModel { Result = LoginResult.UnSuccessfulAttempt });
            }

            try
            {
                var userWorker = new UserWorker(ApplicationContextWrapper);

                //проверяю пароль
                var passCheckResult = await userWorker.CheckUserNameAndPasswordAsync(user.Id, user.UserName, model.Password);

                //если пароль не подходит выдаю ответ
                if (!passCheckResult.IsSucceeded)
                {
                    return new BaseApiResponse<LoginResultModel>(false, "Неудачная попытка входа", new LoginResultModel { Result = LoginResult.UnSuccessfulAttempt, TokenId = null });
                }

                await signInManager.SignInAsync(user, model.RememberMe);
            }
            catch (Exception ex)
            {
                var logger = Context.GetLogger();

                await logger.LogExceptionAsync(ex);

                return new BaseApiResponse<LoginResultModel>(false, ex.Message);
            }


            return new BaseApiResponse<LoginResultModel>(true, "Авторизация прошла успешно", new LoginResultModel { Result = LoginResult.SuccessfulLogin, TokenId = null });
        }

        /// <summary>
        /// Разлогинивание в системе
        /// </summary>
        /// <param name="user"></param>
        /// <param name="authenticationManager"></param>
        /// <returns></returns>
        public BaseApiResponse LogOut(IApplicationAuthenticationManager authenticationManager)
        {
            if (!IsAuthenticated)
            {
                return new BaseApiResponse(false, "Вы и так не авторизованы");
            }

            authenticationManager.SignOut();

            return new BaseApiResponse(true, "Вы успешно разлогинены в системе");
        }

        public AccountLoginWorker(IUserContextWrapper<XdocDbContext> contextWrapper) : base(contextWrapper)
        {
        }
    }
}
