# == Schema Information
#
# Table name: licences
#
#  id              :bigint           not null, primary key
#  activation_code :string
#  start_date      :date
#  end_date        :date
#  status          :integer          default("pending")
#  owner_id        :bigint
#  user_id         :bigint
#  node_id         :bigint
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  charge_id       :string(50)
#  type            :string
#  media_id        :bigint
#

class Licence < ApplicationRecord
  enum status: [:pending, :approved, :rejected]

  belongs_to :user, optional: true, class_name: 'User'

  def approve
    update!(status: :approved)
  end

  def reject
    update!(status: :rejected)
  end


  def update_status(event_type)
    approve if event_type == "charge.succeeded"
    reject if event_type == "charge.failed"
  end

end

