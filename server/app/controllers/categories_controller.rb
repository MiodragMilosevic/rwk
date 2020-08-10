class CategoriesController < ApplicationController
  before_action :set_level
  before_action :authenticate_user

  def index
    @categories = @level.categories
   render :index, status: :ok
  end

  private

  def set_level
    @level = Level.find(params[:level_id])
  end

end
