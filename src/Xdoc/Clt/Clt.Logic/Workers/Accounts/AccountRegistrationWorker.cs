using Clt.Contract.Events;
using Clt.Logic.Models;
using Clt.Logic.Models.Account;
using Croco.Core.Abstractions.ContextWrappers;
using Croco.Core.Common.Models;
using FocLab.Model.Entities.Users.Default;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xdoc.Logic.Workers;
using Xdoc.Model.Contexts;
using Xdoc.Model.Entities;

namespace Clt.Logic.Workers.Accounts
{
    public class AccountRegistrationWorker : XDocBaseWorker
    {
        public AccountRegistrationWorker(IUserContextWrapper<XdocDbContext> contextWrapper) : base(contextWrapper)
        {
        }

        public async Task<BaseApiResponse<ClientModel>> RegisterAsync(RegisterModel model, SignInManager<ApplicationUser> userManager)
        {

            if (IsAuthenticated)
            {
                return new BaseApiResponse<ClientModel>(false, "Вы не можете регистрироваться, так как вы авторизованы в системе");
            }

            var result = await RegisterHelpMethodAsync(model, userManager.UserManager);

            if (!result.IsSucceeded)
            {
                return result;
            }

            var user = result.ResponseObject;

            var eve = new ClientRegisteredEvent
            {
                ClientId = user.Id
            };

            Application.EventPublisher.Publish(eve);

            return new BaseApiResponse<ClientModel>(true, "Регистрация прошла успешно.", user);
        }

        private async Task<BaseApiResponse<ClientModel>> RegisterHelpMethodAsync(RegisterModel model, UserManager<ApplicationUser> userManager)
        {
            var user = new ApplicationUser
            {
                Email = model.Email,
                PhoneNumber = model.PhoneNumber
            };

            var checkResult = await CheckUserAsync(user);

            if (!checkResult.IsSucceeded)
            {
                return new BaseApiResponse<ClientModel>(checkResult.IsSucceeded, checkResult.Message);
            }

            var result = await userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return new BaseApiResponse<ClientModel>(false, result.Errors.ToList().First().Description);
            }

            var client = new Client
            {
                Id = user.Id,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };

            var clientRepo = GetRepository<Client>();

            clientRepo.CreateHandled(client);

            return await TrySaveChangesAndReturnResultAsync("", ClientModel.ToClientModel(client));
        }

        private async Task<BaseApiResponse> CheckUserAsync(ApplicationUser user)
        {
            if (string.IsNullOrWhiteSpace(user.Email))
            {
                return new BaseApiResponse(false, "Вы не указали адрес электронной почты");
            }

            if (string.IsNullOrWhiteSpace(user.PhoneNumber))
            {
                return new BaseApiResponse(false, "Вы не указали номер телефона");
            }

            var userRepo = GetRepository<ApplicationUser>();

            if (await userRepo.Query().AnyAsync(x => x.Email == user.Email))
            {
                return new BaseApiResponse(false, "Пользователь с данным email адресом уже существует");
            }

            if (await userRepo.Query().AnyAsync(x => x.PhoneNumber == user.PhoneNumber))
            {
                return new BaseApiResponse(false, "Пользователь с данным номером телефона уже существует");
            }

            return new BaseApiResponse(true, "");
        }



    }
}
