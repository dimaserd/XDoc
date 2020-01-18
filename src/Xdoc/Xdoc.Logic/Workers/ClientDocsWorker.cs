using Croco.Core.Abstractions;
using Croco.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Xdoc.Logic.Models;
using Xdoc.Model.Entities;
using Xdoc.Model.Enumerations;

namespace Xdoc.Logic.Workers
{
    /// <summary>
    /// Предоставляет методы для работы с документами клиента
    /// </summary>
    public class ClientDocsWorker : XDocBaseWorker
    {
        /// <summary>
        /// Конструктор
        /// </summary>
        /// <param name="context"></param>
        public ClientDocsWorker(ICrocoAmbientContext context) : base(context)
        {
        }

        /// <summary>
        /// Создать или обновить паспорт клиента
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<BaseApiResponse> CreateOrUpdateClientPassport(RussianFederationPassportModel model)
        {
            if(!IsAuthenticated)
            {
                return new BaseApiResponse(false, "Вы не авторизованы");
            }

            var validation = ValidateModel(model);

            if(!validation.IsSucceeded)
            {
                return validation;
            }

            var repo = GetRepository<ClientDocument>();

            var clientId = UserId;

            var oldPassport = await repo.Query()
                .FirstOrDefaultAsync(x => x.ClientId == clientId && x.Type == ClientDocumentType.RussianFederationPassport);

            if(oldPassport != null)
            {
                repo.UpdateHandled(oldPassport);
            }

            var doc = model.ToPassportClientDocument(clientId);

            repo.CreateHandled(doc);

            return await TrySaveChangesAndReturnResultAsync("Паспорт добавлен успешно");
        }

        /// <summary>
        /// Получить документы клиента
        /// </summary>
        /// <returns></returns>
        public async Task<BaseApiResponse<ClientDocumentsModel>> GetClientDocs()
        {
            if(!IsAuthenticated)
            {
                return new BaseApiResponse<ClientDocumentsModel>(false, "Вы не авторизованы");
            }

            var docRepo = GetRepository<ClientDocument>();

            var clientId = UserId;

            var docs = await docRepo.Query()
                .Where(x => x.ClientId == clientId)
                .ToListAsync();

            var model = ClientDocumentsModel.Create(docs);

            return new BaseApiResponse<ClientDocumentsModel>(true, "Ok", model);
        }
    }
}