class InstrumentsController < ApplicationController

  def index
    @instruments = Instrument.all.order(:position)
    @instruments = @instruments.filter_by_name(params[:name]) if params[:name].present?
    render :index, status: :ok
  end

end
