class NodeLicence < Licence

  before_create :set_activation_code

  scope :filter_by_status, ->(status) { where(status: status) }
  scope :filter_by_user, ->(user) { where(user: user) }

  belongs_to :level, foreign_key: :node_id, class_name: 'Level'
  belongs_to :organization, optional: true
  belongs_to :owner, class_name: 'User', optional: true

  validates :activation_code, uniqueness: {case_sensitive: false}
  validate :have_active_licence

  def activate(user)
    raise LicenceUnavailableError if self.user_id.present?
    raise UserAlreadyLicencedError if user.user_licences.where(status: :approved).or(user.user_licences.where(status: :pending)).where(level: self.level).where("end_date >= ?", Date.today.to_date).present?
    update!(user_id: user.id, start_date: Date.today, end_date: Date.today.next_year)
  end

  def instrument
    level.instrument
  end

  private

  def set_activation_code
    self.activation_code = SecureRandom.uuid
  end

  def have_active_licence
    if (self.user_id) then
      user = User.find(self.user_id)
      pp self.status
      if (self.status == 'pending' || self.status == 'approved')
        if user.user_licences.count != 0
          if user.user_licences.where(status: :approved).where(node_id: self.level.id).present?
            errors.add(:base, "User already have active or pending this licence")
          end
        end
      end

     end
  end

end
