require 'active_support/all'

module MultiLanguage
  module OverrideMethods
    def translates (*args)
      args.each do |attribute|
        define_method attribute do
          class_name = self.class.to_s.downcase
          translation = public_send("#{class_name}_translations").where(locale: I18n.locale, key: attribute).first
          if translation.present?
            translation.value
          else
            self[attribute]
          end
        end
      end
    end
  end

  def self.included(receiver)
    receiver.extend OverrideMethods
  end
end
