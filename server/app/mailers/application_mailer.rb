class ApplicationMailer < ActionMailer::Base
  default from: Rails.application.config.mailer_from_address
  layout 'mailer'
end
