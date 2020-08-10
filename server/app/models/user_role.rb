# == Schema Information
#
# Table name: user_roles
#
#  id              :bigint           not null, primary key
#  role            :integer          not null
#  user_id         :bigint           not null
#  organization_id :bigint
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class UserRole < ApplicationRecord
  enum role: [:basic, :user_organization, :admin_organization, :admin]

  belongs_to :user
  belongs_to :organization, optional: true

  validates :role, presence: true
  validates :user, presence: true

end
