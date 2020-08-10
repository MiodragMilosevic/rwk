class MediasController < ApplicationController
  before_action :authenticate_user

  def create
    @media = Media.upload_and_create(create_params)
    render :show, status: :created
  end

  def index
    @medias = Media.all
    render :index, status: :ok
  end

  def show
    @media = Media.find(params[:id])
    render :show, status: :ok
  end

  private

  def create_params
    params.permit(:name, :author, :price, :duration, :place, :file, :content)
  end

end
