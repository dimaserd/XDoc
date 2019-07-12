using Croco.Core.Utils;
using System;
using System.ComponentModel;
using Xdoc.Model.Entities;
using Xdoc.Model.Enumerations;

namespace Xdoc.Logic.Models
{
    public class RussianFederationPassportModel
    {
        /// <summary>
        /// Кем выдан
        /// </summary>
        [Description("Кем выдан")]
        public string IssuedBy { get; set; }

        /// <summary>
        /// Дата выдачи
        /// </summary>
        [Description("Дата выдачи")]
        public DateTime IssueDate { get; set; }

        /// <summary>
        /// Местро рождения
        /// </summary>
        [Description("Место рождения")]
        public string BirthPlace { get; set; }

        /// <summary>
        /// Серия паспорта
        /// </summary>
        [Description("Серия паспорта")]
        public string Series { get; set; }

        /// <summary>
        /// Номер
        /// </summary>
        [Description("Номер")]
        public string Number { get; set; }

        /// <summary>
        /// Дата рождения
        /// </summary>
        [Description("Дата рождения")]
        public DateTime BirthDate { get; set; }

        /// <summary>
        /// Имя
        /// </summary>
        [Description("Имя")]
        public string Name { get; set; }

        /// <summary>
        /// Фамилия
        /// </summary>
        [Description("Фамилия")]
        public string Surname { get; set; }

        /// <summary>
        /// Отчество
        /// </summary>
        [Description("Отчество")]
        public string Patronymic { get; set; }

        public ClientDocument ToPassportClientDocument(string clientId)
        {
            return new ClientDocument
            {
                ClientId = clientId,
                DocumentJson = Tool.JsonConverter.Serialize(this),
                Type = ClientDocumentType.RussianFederationPassport
            };
        }
    }
}
