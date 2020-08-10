class LeafTranslation < Translation
  validates :leaf_id, presence: true

  belongs_to :leaf

  validate :already_exist, on: :create


  private

  def already_exist
    translations = Translation.find_by(locale: self.locale, key: self.key, leaf_id: self.leaf_id)
    unless translations.nil?
      errors.add(:base, "This translate already exist")
    end
  end
end
