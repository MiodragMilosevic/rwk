class CountriesController < ApplicationController

  def index
    @countries = Country.all
    @countries = @countries.filter_by_name(params[:name]) if params[:name].present?
    render :index, status: :ok
  end

  def show
    @country = Country.find(params[:id])
    render :show, status: :ok
  end
end
