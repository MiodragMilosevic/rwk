class LevelsController < ApplicationController
  before_action :set_instrument

  def index
    @levels = @instrument.levels
   render :index, status: :ok
  end

  private

  def set_instrument
    @instrument = Instrument.find(params[:instrument_id])
  end

end
