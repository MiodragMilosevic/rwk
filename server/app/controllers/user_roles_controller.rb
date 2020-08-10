class UserRolesController < ApplicationController

  def create
    @user_role = UserRole.create!(user_role_params)
    render :show, status: :created
  end

  private

  def user_role_params
    params.permit(:role, :user_id, :organization_id)
  end
end