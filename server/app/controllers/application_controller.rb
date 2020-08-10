class ApplicationController < ActionController::API
  include Authenticatable
  include ErrorRescuable
  include Pundit

  before_action :set_locale

  private

  def set_locale
    I18n.locale = request.headers[:locale]
  rescue I18n::InvalidLocale
    I18n.locale = :en
  end
end
