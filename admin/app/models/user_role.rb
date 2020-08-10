class UserRole < ApplicationRecord
  establish_connection SEC_DATABASE
  enum role: [:basic, :user_organization, :admin_organization, :admin]

  belongs_to :user
  belongs_to :organization, optional: true

  validates :role, presence: true
  validates :user, presence: true

end