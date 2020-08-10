class MediaLicencesController < ApplicationController
  before_action :authenticate_user!

  def create
    @media_licence = MediaLicence.create!(media_licence_params.merge(user_id: current_user.id))
    render :show, status: :created
  end

  private

  def media_licence_params
    params.permit(:media_id)
  end
end
