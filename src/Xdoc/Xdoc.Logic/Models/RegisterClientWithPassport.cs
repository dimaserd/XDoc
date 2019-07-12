using System;
using System.Collections.Generic;
using System.Text;

namespace Xdoc.Logic.Models
{
    public class RegisterClient
    {
        public string PhoneNumber { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }
    }

    public class RegisterClientWithPassport
    {
        /// <summary>
        /// Паспорт клиента
        /// </summary>
        public RussianFederationPassportModel Passport { get; set; }
    }
}
