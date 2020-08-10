class OrganizationsController < ApplicationController
  before_action :authenticate_user!

  def create
    @organization = Organization.create_for_user(current_user, organization_params)
    render :show, status: :created
  end

  private

  def organization_params
    params.permit(:name)
  end

end
