class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  SEC_DATABASE="#{Rails.env}-sec".to_sym
end
