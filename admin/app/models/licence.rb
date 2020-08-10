# == Schema Information
#
# Table name: licences
#
#  id              :bigint(8)        not null, primary key
#  activation_code :string
#  start_date      :date
#  end_date        :date
#  status          :integer          default("pending")
#  owner_id        :bigint(8)
#  user_id         :bigint(8)
#  node_id         :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  charge_id       :string(50)
#

class Licence < ApplicationRecord
  establish_connection SEC_DATABASE
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

