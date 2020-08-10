# == Schema Information
#
# Table name: organizations
#
#  id         :bigint(8)        not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Organization < ApplicationRecord
  establish_connection SEC_DATABASE
  has_many :user_roles, dependent: :destroy

  validates :name, presence: true

  class << self
    def create_for_user(user, params)
      organization = create!(params)
      UserRole.create!(role: :admin_organization, user: user, organization: organization)
      organization
    end
  end


end
