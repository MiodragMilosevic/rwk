# == Schema Information
#
# Table name: organizations
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Organization < ApplicationRecord
  has_many :user_roles

  validates :name, presence: true

  class << self
    def create_for_user(user, params)
      organization = create!(params)
      UserRole.create!(role: :admin_organization, user: user, organization: organization)
      organization
    end
  end


end
