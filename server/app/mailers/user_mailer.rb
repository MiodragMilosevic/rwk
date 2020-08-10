class UserMailer < ApplicationMailer

  def verification(user, token)
    @user = user
    @token = token
    mail to: @user.email_address, subject: "You've been registered to Wagner, #{@user.first_name}"
  end

  def forgot_password(user, token)
    @user = user
    @token = token
    mail to: @user.email_address, subject: "You've received reset password for Wagner, #{@user.first_name}"
  end
end