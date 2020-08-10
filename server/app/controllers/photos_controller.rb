class PhotosController < ApplicationController
  #before_action :authenticate_user

  def show
    @photo = Photo.find(params[:id])
    render :show, status: :ok
  end

  def create
    @photo = Photo.create!(create_params)
    render :show, status: :created
  end

  def create_params
    params.permit(:image)
  end

end

