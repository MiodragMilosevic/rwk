class WebHooksController < ApplicationController

  def stripe
    json = JSON.parse request.body.read
    event_type = json['type']
    charge_id = json['data']['object']['id']
    licence = Licence.find_by(charge_id: charge_id)
    licence.update_status(event_type) if licence.present?
    raise ActiveRecord::RecordNotFound if licence.nil?
    render json: {}, status: :ok
  end
end
