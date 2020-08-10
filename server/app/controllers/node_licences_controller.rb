class NodeLicencesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: :index

  def index
    authorize(@user, :show?)
    @node_licences = @user.user_licences
    @node_licences = @node_licences.filter_by_status(params[:status]) if params[:status].present?
    render :index, status: :ok
  end

  def create
    @node_licence = NodeLicence.create!(licence_params.merge(owner_id: current_user.id))
    render :show, status: :created
  end

  def activate
    NodeLicence.transaction do
      @node_licence = NodeLicence.lock.find_by!(activation_code: params[:activation_code])
      @node_licence.activate(current_user)
    end
    render :show, status: :ok
  end

  private

  def licence_params
    params.permit(:node_id)
  end

  def set_user
    @user = User.find(params[:user_id])
  end

end
