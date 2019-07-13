using Croco.Core.Utils;
using System.Collections.Generic;
using System.Linq;
using Xdoc.Logic.Models;
using Xdoc.Model.Entities;
using Xdoc.Model.Enumerations;

namespace Xdoc.Logic.Workers
{
    /// <summary>
    /// Документы клиента
    /// </summary>
    public class ClientDocumentsModel
    {
        /// <summary>
        /// Паспорт
        /// </summary>
        public RussianFederationPassportModel Passport { get; set; }

        public static ClientDocumentsModel Create(List<ClientDocument> clientDocuments)
        {
            var passport = clientDocuments.FirstOrDefault(x => x.Type == ClientDocumentType.RussianFederationPassport);

            return new ClientDocumentsModel
            {
                Passport = passport != null ?
                    Tool.JsonConverter.Deserialize<RussianFederationPassportModel>(passport.DocumentJson) : null
            };
        }
    }
}
