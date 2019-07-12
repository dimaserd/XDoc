using System.ComponentModel.DataAnnotations;

namespace Clt.Logic.Models.Account
{
    public class LoginModel : LoginModelBase
    {
        public LoginModel()
        {

        }

        public LoginModel(LoginByPhoneNumberModel model, string email)
        {
            Email = email;

            Password = model.Password;
            RememberMe = model.RememberMe;
        }

        [Required(ErrorMessage = "Необходимо указать адрес электронной почты")]
        [Display(Name = "Адрес электронной почты")]
        [EmailAddress]
        public string Email { get; set; }

    }
}
