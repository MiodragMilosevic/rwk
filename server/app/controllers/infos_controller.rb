class InfosController < ApplicationController

  def index
    @pages = Info.all
    @pages = @pages.filter_by_name(params[:name]) if params[:name].present?
    render :index, status: :ok
  end
end
